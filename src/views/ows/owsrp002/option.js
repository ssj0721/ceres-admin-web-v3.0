export const formOption = {
  submitBtn: false,
  emptyBtn: false,
  column: [
    {
      label: "款号",
      prop: "itemcode",
      // dicData: [],
      span: 8,
      placeholder: "多款用空格、半角逗号或换行符分隔，单款号时模糊查询",
      hide: true,
      overHidden: true,
    },
    {
      label: '款字头',
      type: 'input',
      prop: 'bndid',
      placeholder: '输入款字头(jws,jmf..)用空格、半角逗号或换行符分隔',
      // dicData: [],
    },
  ],
};
