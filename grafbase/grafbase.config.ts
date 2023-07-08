import { g, auth, config } from "@grafbase/sdk";
import { Model } from "@grafbase/sdk/dist/src/model";

// Welcome to Grafbase!
// Define your data models, integrate auth, permission rules, custom resolvers, search, and more with Grafbase.
// Integrate Auth
// https://grafbase.com/docs/auth
//
// const authProvider = auth.OpenIDConnect({
//   issuer: process.env.ISSUER_URL ?? ''
// })
//
// Define Data Models
// https://grafbase.com/docs/database

// const post = g
//   .model("Post", {
//     title: g.string(),
//     slug: g.string().unique(),
//     content: g.string().optional(),
//     publishedAt: g.datetime().optional(),
//     comments: g
//       .relation(() => comment)
//       .optional()
//       .list()
//       .optional(),
//     likes: g.int().default(0),
//     tags: g.string().optional().list().length({ max: 5 }),
//     author: g.relation(() => user).optional(),
//   })
//   .search();
//
// const comment = g.model("Comment", {
//   post: g.relation(post),
//   body: g.string(),
//   likes: g.int().default(0),
//   author: g.relation(() => user).optional(),
// });

const User: Model = g
  .model("User", {
    name: g.string().length({ min: 2, max: 20 }),
    email: g.email().unique(),
    avatarUrl: g.url().optional(),
    description: g.string().optional(),
    githubUrl: g.url().optional(),
    linkedInUrl: g.url().optional(),
    projects: g
      .relation(() => Project)
      .list()
      .optional(),
    // comments: g.relation(comment).optional().list(),

    // Extend models with resolvers
    // https://grafbase.com/docs/edge-gateway/resolvers
    // gravatar: g.url().resolver('user/gravatar')
  })
  .auth((rules) => {
    rules.public().read();
  });

const Project: Model = g
  .model("Project", {
    title: g.string().length({ min: 3 }),
    description: g.string(),
    image: g.url(),
    liveSiteUrl: g.url(),
    githubUrl: g.url(),
    createdBy: g.relation(() => User),
    category: g.string().search(),
  })
  .auth((rules) => {
    rules.public().read();
    rules.private().create().delete().update();
  });

const jwt = auth.JWT({
  issuer: "grafbase",
  // secret: g.env("NEXTAUTH_SECRET"),
  //Error: could not load grafbase/grafbase.config.ts
  // Caused by: 'Environment variable NEXTAUTH_SECRET is not set'
  secret: process.env.NEXTAUTH_SECRET!,
});

export default config({
  schema: g,
  // Integrate Auth
  // https://grafbase.com/docs/auth
  auth: {
    providers: [jwt],
    rules: (rules) => rules.private(),
  },
});
