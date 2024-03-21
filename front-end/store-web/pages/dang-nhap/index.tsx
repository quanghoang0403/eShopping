import { Button, Card, Checkbox, Input, Typography } from '@material-tailwind/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function LoginPage() {
  return (
    <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        Đăng nhập
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        Chào mừng bạn quay lại với Cúc Hoạ Mi, mời bạn đăng nhập để tiếp tục mua sắm!
      </Typography>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Email
          </Typography>
          <Input
            size="lg"
            placeholder="name@mail.com"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Mật khẩu
          </Typography>
          <Input
            type="password"
            size="lg"
            placeholder="********"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
          />
        </div>
        <Button className="mt-6" fullWidth>
          Đăng nhập
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Chưa có tài khoản?{' '}
          <Link href="#" className="font-medium text-gray-900">
            Đăng ký
          </Link>
        </Typography>
      </form>
    </Card>
  )
}
