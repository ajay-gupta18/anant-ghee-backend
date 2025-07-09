import { OmitType, PartialType, PickType } from "@nestjs/swagger";
import { SignUpDto } from "./signup.dto";

export class SignInDto extends OmitType(SignUpDto, ['name' as const]) {

} 