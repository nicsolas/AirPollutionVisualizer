import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const EffectsPage = () => (
  <div className="container mx-auto px-4 py-8 flex flex-col min-h-[calc(100vh-4rem)]">
    <div className="flex items-center mb-6">
      <Link to="/" className="mr-4 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <h1 className="text-3xl font-bold">Effetti sull'Ambiente</h1>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      <div className="flex flex-col items-center text-center bg-blue-50 rounded-xl shadow p-6">
        <img src="/textures/earth.png" alt="Effetti globali" className="w-28 h-28 object-contain mb-2 rounded-full shadow" />
        <div className="font-semibold text-blue-800 mb-1">Effetti globali</div>
        <div className="text-blue-900 text-sm">Cambiamento climatico, riscaldamento globale, impatti su ecosistemi e biodiversità.</div>
      </div>
      <div className="flex flex-col items-center text-center bg-green-50 rounded-xl shadow p-6">
        <img src="/textures/inquinamento acqua.png" alt="Contaminazione delle acque" className="w-28 h-28 object-contain mb-2 rounded-full shadow" />
        <div className="font-semibold text-green-800 mb-1">Contaminazione delle acque</div>
        <div className="text-green-900 text-sm">Deposizione di inquinanti atmosferici nei laghi, fiumi e mari.</div>
      </div>
      <div className="flex flex-col items-center text-center bg-yellow-50 rounded-xl shadow p-6">
        <img src="/textures/Inquinamento suolo.png" alt="Effetti su suolo e colture" className="w-28 h-28 object-contain mb-2 rounded-full shadow" />
        <div className="font-semibold text-yellow-800 mb-1">Effetti su suolo e colture</div>
        <div className="text-yellow-900 text-sm">Riduzione della fertilità e della produttività agricola.</div>
      </div>
    </div>
    <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto mb-8">
      <h2 className="text-xl font-semibold mb-2 text-blue-900">Altri effetti ambientali</h2>
      <ul className="list-disc pl-5 space-y-2 text-base text-blue-900">
        <li><b>Inquinamento dell'aria:</b> Danni a ecosistemi, foreste e colture a causa di ozono, particolato e altri inquinanti.</li>
        <li><b>Acidificazione:</b> Piogge acide che alterano il pH di suoli e acque, danneggiando flora e fauna.</li>
        <li><b>Perdita di biodiversità:</b> Specie animali e vegetali minacciate da habitat degradati e inquinamento.</li>
      </ul>
    </div>
  </div>
);

export default EffectsPage;
