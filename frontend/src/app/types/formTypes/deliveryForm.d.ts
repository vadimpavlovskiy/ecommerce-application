import { E164Number } from "libphonenumber-js/core";
export interface IDeliveryForm {
  name: string | null;
  email: string | null;
  address: string | null;
  addressLine2: string | null;
  city: string | null;
  postalCode: string | null;
  phone: E164Number | undefined;
  comment: string | null;
}
