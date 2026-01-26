'use client'

import type { SiteContent } from '../../stores/config-store'
import type { ArtImageUploads, BackgroundImageUploads, FileItem, SocialButtonImageUploads } from './types'
import { FaviconAvatarUpload } from './favicon-avatar-upload'
import { SiteMetaForm } from './site-meta-form'
import { ArtImagesSection } from './art-images-section'
import { BackgroundImagesSection } from './background-images-section'
import { SocialButtonsSection } from './social-buttons-section'
import { HatSection } from './hat-section'
import { BeianForm } from './beian-form'

export type { FileItem, ArtImageUploads, BackgroundImageUploads, SocialButtonImageUploads } from './types'

interface SiteSettingsProps {
	formData: SiteContent
	setFormData: React.Dispatch<React.SetStateAction<SiteContent>>
	faviconItem: FileItem | null
	setFaviconItem: React.Dispatch<React.SetStateAction<FileItem | null>>
	avatarItem: FileItem | null
	setAvatarItem: React.Dispatch<React.SetStateAction<FileItem | null>>
	artImageUploads: ArtImageUploads
	setArtImageUploads: React.Dispatch<React.SetStateAction<ArtImageUploads>>
	backgroundImageUploads: BackgroundImageUploads
	setBackgroundImageUploads: React.Dispatch<React.SetStateAction<BackgroundImageUploads>>
	socialButtonImageUploads: SocialButtonImageUploads
	setSocialButtonImageUploads: React.Dispatch<React.SetStateAction<SocialButtonImageUploads>>
}

export function SiteSettings({
	formData,
	setFormData,
	faviconItem,
	setFaviconItem,
	avatarItem,
	setAvatarItem,
	artImageUploads,
	setArtImageUploads,
	backgroundImageUploads,
	setBackgroundImageUploads,
	socialButtonImageUploads,
	setSocialButtonImageUploads
}: SiteSettingsProps) {
	return (
		<div className='space-y-6'>
			<FaviconAvatarUpload faviconItem={faviconItem} setFaviconItem={setFaviconItem} avatarItem={avatarItem} setAvatarItem={setAvatarItem} />

			<SiteMetaForm formData={formData} setFormData={setFormData} />

			<BeianForm formData={formData} setFormData={setFormData} />

			<SocialButtonsSection
				formData={formData}
				setFormData={setFormData}
				socialButtonImageUploads={socialButtonImageUploads}
				setSocialButtonImageUploads={setSocialButtonImageUploads}
			/>

			<ArtImagesSection formData={formData} setFormData={setFormData} artImageUploads={artImageUploads} setArtImageUploads={setArtImageUploads} />

			<BackgroundImagesSection
				formData={formData}
				setFormData={setFormData}
				backgroundImageUploads={backgroundImageUploads}
				setBackgroundImageUploads={setBackgroundImageUploads}
			/>

			<div className='flex gap-3'>
				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.clockShowSeconds ?? false}
						onChange={e => setFormData({ ...formData, clockShowSeconds: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>时钟显示秒数</span>
				</label>

				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.summaryInContent ?? false}
						onChange={e => setFormData({ ...formData, summaryInContent: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>摘要放入内容</span>
				</label>

				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.hideEditButton ?? false}
						onChange={e => setFormData({ ...formData, hideEditButton: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>隐藏编辑按钮（编辑快捷键 ctrl/cmd + ,）</span>
				</label>
			</div>
			<div className='flex gap-3'>
				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.isCachePem ?? false}
						onChange={e => setFormData({ ...formData, isCachePem: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>缓存PEM(已加密，但存在风险)</span>
				</label>
				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.enableCategories ?? false}
						onChange={e => setFormData({ ...formData, enableCategories: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>启用文章分类</span>
				</label>
				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.enableChristmas ?? false}
						onChange={e => setFormData({ ...formData, enableChristmas: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>开启圣诞节</span>
				</label>
			</div>

			<div className='mt-4'>
				<div className='flex items-center gap-3'>
					<label className='flex items-center gap-2'>
						<input
							type='checkbox'
							checked={formData.enablePasswordAccess ?? false}
							onChange={e => setFormData({ ...formData, enablePasswordAccess: e.target.checked })}
							className='accent-brand h-4 w-4 rounded'
						/>
						<span className='text-sm font-medium'>开启密码访问</span>
					</label>

					{formData.enablePasswordAccess && (
					<>
						<select
							className='bg-secondary/10 flex-1 min-w-[120px] rounded-lg border px-3 py-2 text-sm'
							value={(formData.passwordAccessCategories ?? [])[0] || ''}
							onChange={(e) => {
								const selected = e.target.value ? [e.target.value] : [];
								setFormData({ ...formData, passwordAccessCategories: selected });
							}}
						>
							<option value=''>选择分类</option>
							<option value='Notes'>{formData.passwordAccessPassword && formData.passwordAccessCategories?.includes('Notes') ? '🔒' : '🔓'} 笔记</option>
							<option value='Soft'>{formData.passwordAccessPassword && formData.passwordAccessCategories?.includes('Soft') ? '🔒' : '🔓'} 软件</option>
							<option value='Games'>{formData.passwordAccessPassword && formData.passwordAccessCategories?.includes('Games') ? '🔒' : '🔓'} 游戏</option>
							<option value='Chara'>{formData.passwordAccessPassword && formData.passwordAccessCategories?.includes('Chara') ? '🔒' : '🔓'} 角色</option>
							<option value='blog'>{formData.passwordAccessPassword && formData.passwordAccessCategories?.includes('blog') ? '🔒' : '🔓'} 博客</option>
						</select>

						<input
							type='password'
							placeholder='请输入密码'
							className='bg-secondary/10 flex-1 min-w-[120px] rounded-lg border px-3 py-2 text-sm'
							value={formData.passwordAccessPassword ?? ''}
							onChange={(e) => setFormData({ ...formData, passwordAccessPassword: e.target.value })}
						/>
					</>
				)}
				</div>
			</div>

			<HatSection formData={formData} setFormData={setFormData} />
		</div>
	)
}
