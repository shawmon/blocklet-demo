export const validator = {
  name(value: unknown) {
    if (typeof value === 'string' && value.length >= 4 && value.length <= 128) {
      return undefined;
    }
    return 'The name must be a string with a minimum of 4 characters and a maximum of 128 characters.';
  },
  description(value: unknown) {
    if (typeof value === 'string' && value.length >= 10 && value.length <= 1024) {
      return undefined;
    }
    return 'The description must be a string with a minimum of 10 characters and a maximum of 1024 characters.';
  },
  phone(value: unknown) {
    if (typeof value === 'string' && /^\d{10,24}$/.test(value)) {
      return undefined;
    }
    return 'The phone must be a valid phone number.';
  },
  email(value: unknown) {
    if (
      typeof value === 'string' &&
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value,
      )
    ) {
      return undefined;
    }
    return 'The email must be a valid email.';
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  picture(value: unknown) {
    // Since we currently allow data URLs, we are temporarily skipping the validation.
    return undefined;
  },
  address(value: unknown) {
    if (typeof value === 'string' && value.length >= 1 && value.length <= 1024) {
      return undefined;
    }
    return 'The address must be a string with a minimum of 1 characters and a maximum of 1024 characters.';
  },
  hobby(value: unknown) {
    if (typeof value === 'string' && value.length >= 1 && value.length <= 1024) {
      return undefined;
    }
    return 'The hobby must be a string with a minimum of 1 characters and a maximum of 1024 characters.';
  },
};
