// app/components/ApproveButton.tsx
'use client'; // 🌟 告訴 Next.js 這是一個可以在瀏覽器互動的客戶端元件

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ApproveButton({ id }: { id: string | number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setLoading(true);
    // 🌟 更新資料庫：把這筆資料的狀態改成 approved
    const { error } = await supabase
      .from('carparks')
      .update({ status: 'approved' })
      .eq('id', id);

    if (!error) {
      // 🌟 神奇魔法：成功後自動重新整理頁面資料，更新上方卡片的數字！
      router.refresh(); 
    } else {
      alert('更新失敗，請檢查網路或權限');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
    >
      <Check size={16} />
      {loading ? '處理中...' : '核准上架'}
    </button>
  );
}