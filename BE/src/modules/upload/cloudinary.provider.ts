import { v2 } from "cloudinary";

export const CloudinaryProvider = {
  provide: "Cloudinary",
  useFactory: () => {
    return v2.config({
      cloud_name: "titus-nguyen",
      api_key: "223169328129274",
      api_secret: "hVOCwkDi_-h9EorXURYFv4_xV60",
    });
  },
};
