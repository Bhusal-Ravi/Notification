
import { auth } from "../utils/auth.js";

 export function registerSocketHandlers(io) {

  io.use(async (socket, next) => {
    try {
      const session = await auth.api.getSession({
        headers: socket.request.headers
      });

      if (!session?.user) {
        return next(new Error("Unauthorized"));
      }

      socket.userId = session.user.id; 

      next();
    } catch (err) {
        console.log(err)
      next(new Error("Auth failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

    socket.join(`user:${userId}`);

    console.log("User connected:", userId);
  });
}