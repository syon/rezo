import dynamic from 'next/dynamic'

const Floor = dynamic(() => import('../components/Floor'), {
  ssr: false,
})

const Page = () => {
  return <Floor />
}

export default Page
