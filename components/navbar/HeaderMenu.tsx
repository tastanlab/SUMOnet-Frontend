"use client"
import { Menu, Group, Center, Burger, Container, Anchor, Transition } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import classes from './HeaderMenu.module.css';
import { useState } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname from next/navigation

const links = [
  { link: '/about', label: 'About' },
  {
    label: 'Predict',
    links: [
      { link: '/uniprot-id', label: 'Uniprot ID Prediction' },
      { link: '/protein-sequence', label: 'Protein Sequence Prediction' },
      { link: '/fasta-file', label: 'Fasta File Prediction' }
    ],
  },
  { link: '/tutorial', label: 'Tutorial' },
];

export function HeaderMenu() {
  const pathname = usePathname(); // Get the current pathname using usePathname
  const [opened, setOpened] = useState(false);

  const isActivePredictLink = () => {
    return ['/uniprot-id', '/protein-sequence', '/fasta-file','/'].includes(pathname);
  };

  const isActiveAboutLink = () => {
    return pathname === '/about';
  };

  const isActiveTutorialLink = () => {
    return pathname === '/tutorial';
  };

  const isActiveLink = (label) => {
    if (label === 'Predict') {
      return isActivePredictLink();
    } else if (label === 'About') {
      return isActiveAboutLink();
    } else if (label === 'Tutorial') {
      return isActiveTutorialLink();
    }
    return false;
  };

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <a href={item.link} key={item.link} className={classes.noUnderline}>
        <Menu.Item key={item.link}>{item.label}</Menu.Item>
      </a>
    ));

    if (menuItems) {
      return (
        <Menu  key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
          <Menu.Target>
            <a
              key={link.label}
              href={link.link}
              className={`${classes.link} ${isActiveLink(link.label) ? classes.activeLink : ''}`}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size="0.9rem" stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <a
        key={link.label}
        href={link.link}
        className={`${classes.link} ${isActiveLink(link.label) ? classes.activeLink : ''}`}
      >
        {link.label}
      </a>
    );
  });

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Anchor href='/uniprot-id'
        variant="gradient"
        gradient={{ from: 'blue', to: 'blue' }}
        styles={(theme)=>({
          root:{
            fontSize:'40px',
            fontFamily: "Roboto Mono, monospace",
          },
        })}
        
        size='xl'
        c={'blue'}
        fw={700}
        underline='never'
        >
          SUMONET
        </Anchor>
        <Group gap={15} visibleFrom="xs">
          {items}
        </Group>

        <Burger
          opened={opened}
          onClick={() => {
            setOpened(!opened);
          }}
          hiddenFrom="xs"
          size="sm"
        >
          <Transition
            mounted={opened}
            transition="scale-x"
            duration={400}
            timingFunction="ease"
          >
            {styles => (
              <Group style={styles} className={classes.navList}>
                {items}
              </Group>
            )}
          </Transition>
        </Burger>
      </Container>
    </header>
  );
}

export default HeaderMenu;