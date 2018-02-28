export default {
  plugins: ['umi-plugin-dva'],
  // pages: {
  //   '/index': { context: { title: 'IndexPage' } },
  //   '/list':  { context: { title: 'ListPage' } },
  // },
  context: {
    title: 'Unnamed Page',
  },
  preact: false,
  loading: './src/components/ui/Loader.js',
  // hd: false,
};
