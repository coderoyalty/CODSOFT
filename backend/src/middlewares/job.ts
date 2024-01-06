import AuthRequest from "@/interfaces/auth.request";
import express from "express";
import { JobValidator } from "@/validators/job";
import { Role } from "@/models/user";
import { BadRequestError, CustomAPIError } from "@/errors";
import { StatusCodes } from "http-status-codes";

const validateJobData = async (
	req: AuthRequest,
	_res: express.Response,
	next: express.NextFunction,
) => {
	if (req.user?.role !== Role.EMPLOYER) {
		next(
			new CustomAPIError(
				"You're restricted from the action",
				StatusCodes.FORBIDDEN,
			),
		);
	}

	const output = JobValidator.safeParse(req.body);
	if (!output.success) {
		console.log(output.error.errors);
		next(new BadRequestError("please provide correct information"));
	}

	next(null);
};

export { validateJobData };
