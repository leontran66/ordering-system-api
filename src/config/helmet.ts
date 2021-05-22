export default {
  contentSecurityPolicy: {
    directives: {
      baseUri: ['self'],
      blockAllMixedContent: [],
      connectSrc: ['self'],
      defaultSrc: ['self'],
      fontSrc: ['self'],
      frameAncestors: ['self'],
      imgSrc: ['self', 'blob:', 'data:', 'https://res.cloudinary.com'],
      objectSrc: ['none'],
      scriptSrc: ['self'],
      scriptSrcAttr: ['none'],
      styleSrc: ['self', 'unsafe-inline'],
      upgradeInsecureRequests: [],
      workerSrc: ['self', 'blob:'],
    },
  },
};
