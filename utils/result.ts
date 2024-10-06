export type Result<T> =
    | {
          ok: true;
          data: T;
      }
    | {
          ok: false;
          error: Err;
      };

type Err = {
    message: string;
};

export const ok = <T>(data: T): Result<T> => {
    return { ok: true, data: data };
};

export const err = <T>(message: string): Result<T> => {
    return {
        ok: false,
        error: {
            message: message,
        },
    };
};
