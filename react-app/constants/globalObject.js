const globalObject = {
  runtime: {
    handlerUrl: (_, url) => url
  },
  element: null,
  context: null,
  isStudioView: false,
  xblockId: null,
  isEditView: false,
};

export default globalObject;
