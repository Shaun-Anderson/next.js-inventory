import { ReactNode } from 'react'
import Head from 'next/head'
import styles from './layout.module.css'
import { AppShell, Navbar, Header } from '@mantine/core';
import Sidebar from '../components/sidebar'
import { Calculator } from 'phosphor-react';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Layouts Example</title>
      </Head>
      <AppShell
      padding="md"
      className={styles.root}
      navbar={<Sidebar />}
      styles={(theme) => ({
        main: { paddingTop: '34px', width: 'calc(100vw - 300px)', backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      {children}
    </AppShell>
    </>
  )
}