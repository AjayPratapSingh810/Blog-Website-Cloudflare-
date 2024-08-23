import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { createPostInput, updatePostInput } from "ajay-first-common-app";
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
  } else {
    c.status(403);
    return c.json({ message: "Not Authorized" });
  }
});
blogRouter.get("/bulk", async (c) => {
  try {
    console.log("here 1");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const allBlogs = await prisma.post.findMany();
    return c.json({
      allBlogs,
    });
  } catch (error) {
    c.status(403);
    return c.json({ message: "Error while fetching all blogs" });
  }
});
blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blogId = await c.req.param("id");
  try {
    const blogs = await prisma.post.findMany({
      where: {
        id: blogId,
      },
    });
    return c.json({
      blogs,
    });
  } catch (error) {
    c.status(411);
    return c.json({
      message: "Error while fetching all blogs of user",
    });
  }
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const validation = createPostInput.safeParse(body);
  if (!validation.success) {
    c.status(403);
    return c.json({ error: "Blog post validation failed" });
  }
  const userId = c.get("userId");
  try {
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    });
    return c.json({
      id: blog.id,
    });
  } catch (error) {
    c.status(411);
    return c.json({
      message: "Error while post blog of user",
    });
  }
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  // const validation = updatePostInput.safeParse(body);
  // if (!validation.success) {
  //   c.status(403);
  //   return c.json({ error: "Update blog post validation failed" });
  // }
  try {
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
  } catch (error) {
    c.status(411);
    return c.json({
      message: "Error while updating blog of user",
    });
  }
});
