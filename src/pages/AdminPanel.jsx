import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import MDEditor from '@uiw/react-md-editor';
import CategoryManager from '../components/CategoryManager';
import { useNavigate } from 'react-router-dom';
import CodeExampleManager from '../components/CodeExampleManager';
import { Tabs, TabsList, Tab, TabsContent } from '../components/ui/tabs';

export default function AdminPanel() {
	const navigate = useNavigate();
	const [title, setTitle] = useState('');
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [blocks, setBlocks] = useState([]);
	const [posts, setPosts] = useState([]);
	const [editingPost, setEditingPost] = useState(null);

	// Auth kontrolü
	useEffect(() => {
		const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
		if (!isAuthenticated) {
			navigate('/admin-login');
		}
	}, [navigate]);

	// Kategorileri getir
	const fetchCategories = useCallback(async () => {
		try {
			const querySnapshot = await getDocs(collection(db, 'categories'));
			const categoriesData = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			}));
			setCategories(categoriesData);
		} catch (error) {
			console.error('Kategoriler yüklenirken hata:', error);
		}
	}, []);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	// Blok işlemleri
	const addBlock = (type) => {
		const newBlock = {
			type,
			content: '',
			code: type === 'code' ? '' : undefined,
			codeTitle: type === 'code' ? 'Terminal' : undefined
		};
		setBlocks(prev => [...prev, newBlock]);
	};

	const updateBlock = (index, field, value) => {
		setBlocks(blocks.map((block, i) => {
			if (i === index) {
				return { ...block, [field]: value };
			}
			return block;
		}));
	};

	const removeBlock = (index) => {
		setBlocks(blocks.filter((_, i) => i !== index));
	};

	// Form gönderme
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim() || blocks.length === 0 || selectedCategories.length === 0) {
			alert('Lütfen tüm gerekli alanları doldurun');
			return;
		}

		setLoading(true);
		try {
			const postData = {
				title: title.trim(),
				categories: selectedCategories,
				blocks,
				createdAt: new Date().toISOString()
			};

			await addDoc(collection(db, 'posts'), postData);
			setTitle('');
			setSelectedCategories([]);
			setBlocks([]);
			alert('Yazı başarıyla yayınlandı!');
		} catch (error) {
			console.error('Error:', error);
			alert('Bir hata oluştu!');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto py-4 px-4">
			<Tabs defaultValue="posts">
				<TabsList>
					<Tab value="posts">Yazılar</Tab>
					<Tab value="categories">Kategoriler</Tab>
					<Tab value="code-examples">Kod Örnekleri</Tab>
				</TabsList>

				<TabsContent value="posts">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Başlık */}
						<div>
							<label className="block mb-2">Başlık:</label>
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
								required
							/>
						</div>

						{/* Kategoriler */}
						<div>
							<label className="block mb-2">Kategoriler:</label>
							<div className="flex flex-wrap gap-2">
								{categories.map(category => (
									<button
										key={category.id}
										type="button"
										onClick={() => {
											setSelectedCategories(prev => {
												if (prev.includes(category.name)) {
													return prev.filter(cat => cat !== category.name);
												}
												return [...prev, category.name];
											});
										}}
										className={`px-3 py-1.5 rounded text-sm ${
											selectedCategories.includes(category.name)
												? 'bg-blue-500 text-white'
												: 'bg-gray-700 text-blue-300 hover:bg-gray-600'
										}`}
									>
										{category.name}
									</button>
								))}
							</div>
						</div>

						{/* İçerik Blokları */}
						<div className="space-y-4">
							{blocks.map((block, index) => (
								<div key={index} className="p-4 bg-gray-800 rounded-lg">
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm text-gray-400">
											{block.type === 'text' ? 'Metin' : 'Kod'}
										</span>
										<button
											type="button"
											onClick={() => removeBlock(index)}
											className="text-red-400 hover:text-red-300"
										>
											Sil
										</button>
									</div>

									{block.type === 'text' ? (
										<MDEditor
											value={block.content}
											onChange={(value) => updateBlock(index, 'content', value)}
											preview="edit"
										/>
									) : (
										<div className="space-y-2">
											<input
												type="text"
												value={block.codeTitle}
												onChange={(e) => updateBlock(index, 'codeTitle', e.target.value)}
												placeholder="Başlık (örn: Terminal)"
												className="w-full px-3 py-2 bg-gray-900 rounded"
											/>
											<textarea
												value={block.code}
												onChange={(e) => updateBlock(index, 'code', e.target.value)}
												placeholder="Kodu buraya yazın..."
												className="w-full h-32 p-4 bg-gray-900 text-gray-200 font-mono text-sm rounded"
											/>
										</div>
									)}
								</div>
							))}
						</div>

						{/* Blok Ekleme Butonları */}
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => addBlock('text')}
								className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
							>
								+ Metin Ekle
							</button>
							<button
								type="button"
								onClick={() => addBlock('code')}
								className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
							>
								+ Kod Ekle
							</button>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className={`w-full py-2 rounded ${
								loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-500'
							}`}
						>
							{loading ? 'Yükleniyor...' : 'Yayınla'}
						</button>
					</form>
				</TabsContent>

				<TabsContent value="categories">
					<CategoryManager onCategoryAdded={fetchCategories} />
				</TabsContent>

				<TabsContent value="code-examples">
					<CodeExampleManager />
				</TabsContent>
			</Tabs>
		</div>
	);
}