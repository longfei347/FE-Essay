import fs from 'fs';
import path from 'path';
import process from 'process';

const ignoreList = ['.vuepress', '.vitepress', '.DS_Store'];
const workPath = path.join(process.cwd() + '/docs');

function buildChildren(paths, parentName = '') {
  const files = fs.readdirSync(paths);
  return files
    .map(file => {
      if (ignoreList.includes(file)) return;
      const current = { text: file };
      const subPath = `${paths}/${file}`;
      if (fs.statSync(subPath).isDirectory()) {
        current.collapsible = true;
        current.collapsed = true;
        current.items = buildChildren(subPath, `${parentName}/${file}`);
      } else {
        if (file === 'index.md') {
          current.text = '简介';
          current.items = [{ text: 'readme', link: `${parentName}/` }];
        } else {
          const suffixName = file.slice(-3);
          if (suffixName !== '.md') return;
          current.link = `${parentName}/${file.slice(0, -3)}`;
        }
      }
      return current;
    })
    .filter(item => item);
}
const sidebar = buildChildren(workPath);
let tmp = sidebar.findIndex(i => i.text === '简介');
sidebar.unshift(sidebar[tmp]);
sidebar.splice(tmp + 1, 1);
// fs.writeFileSync('lis.js', 'var list=' + JSON.stringify(sidebar));

module.exports = {
  title: '前端随笔 FE',
  link: '/README',
  search: '',
  description: '记录前端重要知识点和遇到的好文章，同时还有前端重要算法知识，但最关键的是包含各大小厂真题。',
  themeConfig: {
    nav: [{ text: 'GitHub', link: 'https://github.com/longfei347/FE-Essay' }],
    sidebar: sidebar
  },
  dest: path.resolve(__dirname, '../', '../', 'dist'),
  base: '/',
  evergreen: true
};
