import { string, z, ZodError } from "zod";
import { Role } from "@/models/user";

const UserValidator = z.object({
	id: z.string().optional(),
	email: z.string().email(),
	role: z.nativeEnum(Role),
	password: z.string(),
});

const CreateUserValidator = UserValidator.omit({ id: true });

export default UserValidator;
export { CreateUserValidator };
