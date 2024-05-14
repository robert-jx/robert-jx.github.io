import avatar from '@/assets/images/avatar.jpeg';
import { StaticImageData } from 'next/image';

interface AuthorData {
  name: string;
  avatar: string | StaticImageData;
  occupation: string;
  company: {
    name: string;
    link: string;
  };
  organization?: {
    name: string;
    link: string;
  };
  location: string;
  social: {
    email?: string;
    github?: string;
    linkedin?: string; // full link
    twitter?: string;
    facebook?: string;
    youtube?: string;
    bilibili?: string;
    weibo?: string; // full link
    instagram?: string;
  };
}

const authorData: AuthorData = {
  name: 'Robert-jx',
  avatar: avatar,
  occupation: 'Vue front-end engineer',
  company: { name: '', link: '' },
  // organization: {
  //   name: 'ServerlessDevs',
  //   link: 'https://github.com/Serverless-Devs',
  // },
  location: 'China',
  social: {
    // email: 'jasonlamv-t@hotmail.com',
    github: 'robert-jx',
    // linkedin: 'https://www.linkedin.com/in/jason-lam-0827181b0/',
    // bilibili: '10905363',
    // instagram: 'jasonlamvt',
    weibo: 'https://weibo.com/u/6650411989',
    // twitter: 'JasonLamv-t',
    // facebook: 'jasonlamv.t',
    // youtube: '@jasonlamv-t'
  },
};

export default authorData;
