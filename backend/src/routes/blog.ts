import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const header = (await c.req.header("authorization")) || "";
  const token = await header.split(" ")[1];
  const user = await verify(token, c.env.JWT_SECRET);
  if (user) {
    c.set("userId", user.id);
    await next();
    console.log("hllo");
  } else {
    c.status(403);
    return c.json({ message: "Not Authorized" });
  }
});
blogRouter.get("/bulk", async (c) => {
  console.log("here 1");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  console.log("here");
  const allBlogs = await prisma.post.findMany();
  console.log("allBlogs", allBlogs);
  return c.json({
    allBlogs,
  });
});
// blogRouter.get(":id", async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate());
//   const authorId = await c.req.param("id");
//   try {
//     const blogs = await prisma.post.findMany({
//       where: {
//         authorId,
//       },
//     });
//     return c.json({
//       blogs,
//     });
//   } catch (error) {
//     c.status(411);
//     return c.json({
//       message: "Error while fetching all blogs of user",
//     });
//   }
// });

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const userId = c.get("userId");
  console.log("user id ", userId);
  try {
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    });
    console.log("blog", blog);
    return c.json({
      id: blog.id,
    });
  } catch (error) {
    console.log("error", error);
  }
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const blog = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.json({
    blog,
  });
});
blogRouter.get("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  try {
    const blog = await prisma.post.findFirst({
      where: {
        id: body.id,
      },
    });
    return c.json({
      blog,
    });
  } catch (error) {
    c.status(411);
    return c.json({
      message: "Error while fetching blog post",
    });
  }
});
