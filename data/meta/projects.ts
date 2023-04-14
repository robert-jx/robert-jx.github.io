
import { StaticImageData } from 'next/image';
import onlineRetailers from '@/assets/images/projects/online-retailers.png'
import echarts from '@/assets/images/projects/echarts.png'
import mdn from '@/assets/images/projects/mdn.png'
import vite from '@/assets/images/projects/vite.jpg'

export interface Project {
  name: string;
  description: string;
  link: string;
  logo?: string | StaticImageData;
}

export const projects: Project[] = [

  {
    name: 'translate-content',
    description:
      '参与 MDN 文档的本地化，包括翻译并向 MDN 社区提供建设意见',
    link: 'https://github.com/robert-jx/translated-content',
    logo: mdn
  },
  {
    name: 'online-retailers',
    description: '电商后台系统demo开发',
    link: 'https://github.com/robert-jx/online-retailers',
    logo: onlineRetailers
  },
  {
    name: 'echarts-tool',
    description:
      '基于echarts的二次封装demo，使用vue3+typescript+vite',
    link: 'https://github.com/robert-jx/echarts-tool',
    logo: echarts
  },
  {
    name: 'vite-demo',
    description:
      '提供使用vite创建的vue3模板',
    link: 'https://github.com/robert-jx/vite-demo',
    logo: vite
  },
  {
    name: 'dragging-demo',
    description:
      '基于vue3+typescript+vite实现拖拽布点功能',
    link: 'https://github.com/robert-jx/dragging-demo',
  },
  {
    name: 'blowup-picture',
    description:
      '基于clip-path实现平面图不规则区域放大的功能demo',
    link: 'https://github.com/robert-jx/blowup-picture',
  },
  {
    name: 'time-axis',
    description:
      '基于vue2实现的时间滑动组件demo',
    link: 'https://github.com/robert-jx/time-axis',
  },

];
