// app/page.tsx
import { CarFront, Users, MapPin, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ApproveButton from './components/ApproveButton';

export default async function DashboardHome() {
  
  // 1. 抓取上方卡片的統計數字
  const { count: totalCarparks } = await supabase.from('carparks').select('*', { count: 'exact', head: true });
  const { count: pendingCarparks } = await supabase.from('carparks').select('*', { count: 'exact', head: true }).eq('status', 'pending');
  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

  // 2. 🌟 新增：抓取所有「待審核」的車場詳細資料，並依照建立時間排序 (最新的在最上面)
  const { data: pendingList } = await supabase
    .from('carparks')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">iPARK HK 管理後台</h1>
        <p className="text-slate-500 mt-2">歡迎回來，這是目前的系統即時數據。</p>
      </div>
      
      {/* 📊 數據卡片區塊 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-4 bg-blue-100 rounded-lg mr-4"><MapPin className="text-blue-600" size={28} /></div>
          <div><p className="text-sm text-slate-500 font-medium">系統收錄車場總數</p><h3 className="text-3xl font-bold text-slate-800 mt-1">{totalCarparks || 0}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-4 bg-yellow-100 rounded-lg mr-4"><CarFront className="text-yellow-600" size={28} /></div>
          <div><p className="text-sm text-slate-500 font-medium">待審核用戶上傳</p><h3 className="text-3xl font-bold text-slate-800 mt-1">{pendingCarparks || 0}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-4 bg-purple-100 rounded-lg mr-4"><Users className="text-purple-600" size={28} /></div>
          <div><p className="text-sm text-slate-500 font-medium">註冊會員總數</p><h3 className="text-3xl font-bold text-slate-800 mt-1">{totalUsers || 0}</h3></div>
        </div>
      </div>

      {/* 📋 🌟 新增：待審核資料表區塊 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-orange-500" size={24} />
          <h2 className="text-xl font-bold text-slate-800">待審核車場清單</h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
                  <th className="p-4 font-semibold whitespace-nowrap">車場名稱</th>
                  <th className="p-4 font-semibold whitespace-nowrap">地址</th>
                  <th className="p-4 font-semibold whitespace-nowrap">收費資訊</th>
                  <th className="p-4 font-semibold whitespace-nowrap">座標 (Lat, Lng)</th>
                  <th className="p-4 font-semibold whitespace-nowrap text-right">操作</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {pendingList && pendingList.length > 0 ? (
                  pendingList.map((carpark) => (
                    <tr key={carpark.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-900">{carpark.name}</td>
                      <td className="p-4">{carpark.address || '-'}</td>
                      <td className="p-4">{carpark.price_info || '-'}</td>
                      <td className="p-4 text-slate-400 text-xs">
                        {carpark.latitude?.toFixed(5)}, {carpark.longitude?.toFixed(5)}
                      </td>
                      <td className="p-4 text-right">
                        {/* 🌟 帶入剛剛寫好的按鈕，並傳入該車場的 ID */}
                        <ApproveButton id={carpark.id} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400">
                      目前沒有待審核的車場資料 🎉
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}