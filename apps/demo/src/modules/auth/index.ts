import { generateJwtAuthGuard } from "nestlibs-jwt-auth";

export const { JwtAuthGuard, UseJwtAuthGuard, UseAuthUser } = generateJwtAuthGuard("main-auth");
