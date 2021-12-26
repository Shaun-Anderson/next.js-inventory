import type { ReactElement } from 'react'
import Layout from '../../components/layout'
import Sidebar from '../../components/sidebar'
import {Button, Title, Grid, Col, TextInput} from '@mantine/core'
import { ReactTable } from '../../components/table'
import { useModals } from '@mantine/modals';
import { useForm, useForceUpdate } from '@mantine/hooks';
import Link from 'next/link'

type Server = {
    id: number,
    assetNumber: string,
    brand: string,
    model: string,
    serial: string,
    macAddress: string,
}

export default function About() {

  const columns = [
    {
      Header: 'Id',
      accessor: 'id',
    },
    {
      Header: 'Asset Number',
      accessor: 'assetNumber',
    },
    {
      Header: 'Brand',
      accessor: 'brand',
    },
    {
      Header: 'Model',
      accessor: 'model',
    }
  ]

  const data: Server[] = [
    {
      id: 1,
      assetNumber: 'Test #1',
      brand: 'Microsoft',
      model: 'Test Model',
      serial: '00000001',
      macAddress: '1234'
    },
    {
      id: 2,
      assetNumber: 'Test #2',
      brand: 'Lenovo',
      model: 'Test Model',
      serial: '00000001',
      macAddress: '1234'

    },
    {
      id: 3,
      assetNumber: 'Test #3',
      brand: 'Microsoft',
      model: 'Test Model',
      serial: '00000001',
      macAddress: '1234'
    }
  ]

  const modals = useModals();
  const add = () => {
    console.log("Add")
  }
  const form = useForm<Server>({
    initialValues: {
      id: 0,
      assetNumber: '',
      brand: '',
      model: '',
      serial: '',
      macAddress: ''
    },
    validationRules: {
      assetNumber: (value) => /^\S+@\S+$/.test(value),
    },
  });
  const forceUpdate = useForceUpdate();

  const openAddModal = () => {
    
    const add = () => {
      console.log("Add")
      modals.closeModal(id)
    }

    const id = modals.openModal({
      title: 'Add Server',
      children: (
        <form onSubmit={form.onSubmit((values) => add())}>
        <TextInput  
        required
        label="Asset Number" 
        onChange={() => {
          form.getInputProps('assetNumber').onChange()
          forceUpdate()
        }}
        error={form.getInputProps('assetNumber').error}
 />
     <TextInput  
        required
        label="Asset Number" 
 />
          <Button type="submit">Submit</Button>

        </form>
      ),
    });

  };

 

    return (
      <section>

<Grid>
  <Col span={6}>        <Title order={2}>Add A Server</Title>
</Col>
  <Col span={6} sx={{textAlign: 'right'}}>        <Link href="../../servers">
  <Button component='a' variant="light" color="gray" >  Cancel
</Button>
</Link>
</Col>
</Grid>

        <form onSubmit={form.onSubmit((values) => add())}>
        <TextInput  
        required
        label="Asset Number" 
       {...form.getInputProps('assetNumber')}
 />
     <TextInput  
        required
        label="Asset Number" 
 />
          <Button type="submit">Submit</Button>

        </form>
      </section>
    )
  }
  
  About.getLayout = function getLayout(page: ReactElement) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }
  