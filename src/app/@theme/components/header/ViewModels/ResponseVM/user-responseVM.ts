import { BaseResponseVM } from "../../../../../@core/baseModels/baseresponseVM";
import { User } from "../../../../../@core/interfaces/common/users";

export interface UserResponseVM extends BaseResponseVM {
    data?: User;
}