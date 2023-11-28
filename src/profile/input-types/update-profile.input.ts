import { UpdateUserInput } from '../../users/input-types/update-user.input';
import { InputType, OmitType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProfileInput extends PartialType(
    OmitType(UpdateUserInput, ['userRole'])
) { }
