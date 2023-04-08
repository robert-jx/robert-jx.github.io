
import { StaticImageData } from 'next/image';

export interface Project {
  name: string;
  description: string;
  link: string;
  logo?: string | StaticImageData;
}

export const projects: Project[] = [
  {
    name: 'online-retailers',
    description: '电商后台系统开发',
    link: 'https://github.com/robert-jx/online-retailers',
  },
  {
    name: 'echarts-tool',
    description:
      '基于echarts的二次封装项目，使用vue3+typescript+vite',
    link: 'https://github.com/robert-jx/echarts-tool',
  },
  {
    name: 'dragging-demo',
    description:
      '基于vue3+typescript+vite实现拖拽布点功能',
    link: 'https://github.com/robert-jx/dragging-demo',
  },
];
