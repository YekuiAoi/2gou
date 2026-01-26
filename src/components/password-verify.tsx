'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { useConfigStore } from '@/app/(home)/stores/config-store'

type PasswordVerifyProps = {
	category: string
	onVerify: () => void
}

export function PasswordVerify({ category, onVerify }: PasswordVerifyProps) {
	const { siteContent } = useConfigStore()
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const handleVerify = () => {
		if (siteContent.passwordAccessPassword && password === siteContent.passwordAccessPassword) {
			// 验证成功，存储到localStorage，同时存储密码的哈希值
			const passwordHash = siteContent.passwordAccessPassword
			localStorage.setItem(`password_${category}`, 'verified')
			localStorage.setItem(`password_${category}_hash`, passwordHash)
			onVerify()
		} else {
			setError('密码错误，请重新输入')
		}
	}

	return (
		<div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3 }}
				className='bg-white/80 backdrop-blur-sm rounded-xl border p-6 w-full max-w-md shadow-lg'
			>
				<h2 className='text-lg font-medium mb-4'>密码访问</h2>
				<p className='text-sm text-secondary mb-4'>该分类需要密码访问，请输入密码</p>
				
				<div className='space-y-3'>
					<input
						type='password'
						placeholder='请输入密码'
						className='bg-white/60 backdrop-blur-sm w-full rounded-lg border px-3 py-2 text-sm'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
					/>
					
					{error && (
						<p className='text-sm text-red-500'>{error}</p>
					)}
					
					<button
						className='w-full rounded-lg border bg-white/60 backdrop-blur-sm px-3 py-2 text-sm whitespace-nowrap hover:bg-white/80 transition-colors'
						onClick={handleVerify}
					>
						验证
					</button>
				</div>
			</motion.div>
		</div>
	)
}
