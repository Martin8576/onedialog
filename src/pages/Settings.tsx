import { Outlet } from 'react-router-dom'
import { Flex } from 'antd'

export default function Settings() {
  return (
    <Flex vertical style={{ height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <Outlet />
    </Flex>
  )
}
