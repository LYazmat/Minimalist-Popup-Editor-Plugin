import React, { useState } from 'react';
import { PopupEditor } from './components/PopupEditor';
import { Edit2, Plus, Settings, User, Mail, Phone, X } from 'lucide-react';

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Marcus Miranda',
    email: 'marcus@example.com',
    phone: '+55 11 99999-9999'
  });

  const [items, setItems] = useState([
    { id: 1, label: 'Tarefa Principal', status: 'Pendente' },
    { id: 2, label: 'Reunião de Alinhamento', status: 'Agendado' },
    { id: 3, label: 'Revisão de Código', status: 'Concluído' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Popup Editor Plugin</h1>
          <p className="text-gray-500">Minimalista, inteligente e compatível com Bootstrap.</p>
        </header>

        <section className="grid gap-8">
          {/* Example 1: Simple Table Editing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-bottom border-gray-100 bg-gray-50/50">
              <h2 className="font-semibold text-gray-700">Edição em Tabela</h2>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">Item</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <PopupEditor
                        trigger={
                          <span className="font-medium text-blue-600 hover:underline decoration-blue-300 underline-offset-4">
                            {item.label}
                          </span>
                        }
                        render={(close) => (
                          <div className="space-y-3">
                            <label className="block text-xs font-bold text-gray-400 uppercase">Nome da Tarefa</label>
                            <input 
                              autoFocus
                              type="text" 
                              defaultValue={item.label}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                              onChange={(e) => {
                                const newItems = [...items];
                                newItems[idx].label = e.target.value;
                                setItems(newItems);
                              }}
                            />
                          </div>
                        )}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <PopupEditor
                        trigger={
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            {item.status}
                          </span>
                        }
                        render={(close) => (
                          <div className="space-y-3">
                            <label className="block text-xs font-bold text-gray-400 uppercase">Alterar Status</label>
                            <select 
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                              defaultValue={item.status}
                              onChange={(e) => {
                                const newItems = [...items];
                                newItems[idx].status = e.target.value;
                                setItems(newItems);
                              }}
                            >
                              <option>Pendente</option>
                              <option>Agendado</option>
                              <option>Concluído</option>
                              <option>Cancelado</option>
                            </select>
                          </div>
                        )}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Settings size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Example 2: Bootstrap Modal Compatibility */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-700 mb-4">Compatibilidade com Modais</h2>
            <p className="text-sm text-gray-500 mb-6">
              O plugin gerencia o z-index automaticamente para funcionar perfeitamente dentro de modais do Bootstrap (ou similares).
            </p>
            <button 
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus size={18} /> Abrir Modal de Exemplo
            </button>
          </div>
        </section>

        {/* Simulated Bootstrap Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[1050] flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setShowModal(false)}></div>
            <div className="relative w-auto my-6 mx-auto max-w-lg z-[1051]">
              <div className="border-0 rounded-lg shadow-2xl relative flex flex-col w-full bg-white outline-none focus:outline-none min-w-[400px]">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t">
                  <h3 className="text-xl font-semibold">Perfil do Usuário</h3>
                  <button className="p-1 ml-auto bg-transparent border-0 text-gray-400 float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={() => setShowModal(false)}>
                    <X size={24} />
                  </button>
                </div>
                <div className="relative p-6 flex-auto space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                      <User size={32} />
                    </div>
                    <div>
                      <PopupEditor
                        trigger={
                          <div className="group cursor-pointer">
                            <h4 className="text-lg font-bold group-hover:text-indigo-600 flex items-center gap-2">
                              {userData.name} <Edit2 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h4>
                          </div>
                        }
                        render={(close) => (
                          <div className="space-y-3">
                            <label className="block text-xs font-bold text-gray-400 uppercase">Nome Completo</label>
                            <input 
                              autoFocus
                              type="text" 
                              defaultValue={userData.name}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                              onChange={(e) => setUserData({...userData, name: e.target.value})}
                            />
                          </div>
                        )}
                      />
                      <p className="text-sm text-gray-500">Membro desde Março 2024</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Mail size={18} />
                        <span className="text-sm">{userData.email}</span>
                      </div>
                      <PopupEditor
                        trigger={<button className="text-xs text-indigo-600 font-medium hover:underline">Editar</button>}
                        render={(close) => (
                          <div className="space-y-3">
                            <label className="block text-xs font-bold text-gray-400 uppercase">E-mail</label>
                            <input 
                              autoFocus
                              type="email" 
                              defaultValue={userData.email}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                              onChange={(e) => setUserData({...userData, email: e.target.value})}
                            />
                          </div>
                        )}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Phone size={18} />
                        <span className="text-sm">{userData.phone}</span>
                      </div>
                      <PopupEditor
                        trigger={<button className="text-xs text-indigo-600 font-medium hover:underline">Editar</button>}
                        render={(close) => (
                          <div className="space-y-3">
                            <label className="block text-xs font-bold text-gray-400 uppercase">Telefone</label>
                            <input 
                              autoFocus
                              type="text" 
                              defaultValue={userData.phone}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                              onChange={(e) => setUserData({...userData, phone: e.target.value})}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b">
                  <button className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={() => setShowModal(false)}>
                    Fechar
                  </button>
                  <button className="bg-indigo-600 text-white active:bg-indigo-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={() => setShowModal(false)}>
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
