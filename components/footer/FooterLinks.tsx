'use client'
import { Text, Container, ActionIcon, Group, rem, Image, Center, Space } from '@mantine/core';
import classes from './FooterLinks.module.css';

const data = [
  {
    title: 'SUMOnet',
    links: [
      { label: 'About', link: '/about' },
      { label: 'Prediction', link: '/predict' },
      { label: 'Tutorial', link: '/tutorial' },

    ],
  },
];

export function FooterLinks() {

  
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text<'a'>
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        c="white"
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    
    <footer className={classes.footer}>
      <Center className={classes.inner}>
        <div className={classes.logo}>
          <Image 
          src="/logo.png"
          alt="Sabancı University Logo"   
          radius="md"
          fit="contain"/>
        </div>
        <Space w="xl" />
        <div className={classes.logo}>
          <Image 
          src="/tastanlab_logo.png"
          alt="Tastan Lab Logo"   
          radius="md"
          fit="contain"/>
          
        </div>
        
      </Center>
      <Center className={classes.afterFooter}>
        <Center c="white" size="sm">
          © 2024 Sabancı University. All rights reserved.
        </Center>

        
      </Center>
    </footer>
  );
}