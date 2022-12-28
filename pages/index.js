import dynamic from 'next/dynamic'

const Stage = dynamic(() => import('../components/Stage'), {
  ssr: false,
})

const Page = () => {
  return <Stage />
}

export default Page
