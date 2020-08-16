export interface ICtx {
    reply: (message: String, attachment?: String, keyboard?: String | undefined, sticker?: number, randomId?: number | Date) => void,
    session: {
      step: number | undefined,
      name: String,
      target: String,
      phone: String,
      url: String,
    },
    message: {
        user_id: String,
        body: String,
    },
};