import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EnvironmentalEffects = () => (
  <Card className="min-w-[300px]">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">Effetti sull'Ambiente</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="list-disc pl-5 space-y-2 text-base">
        <li><b>Inquinamento dell'aria:</b> Danni a ecosistemi, foreste e colture a causa di ozono, particolato e altri inquinanti.</li>
        <li><b>Acidificazione:</b> Piogge acide che alterano il pH di suoli e acque, danneggiando flora e fauna.</li>
        <li><b>Cambiamento climatico:</b> Emissioni di gas serra (CO₂, metano) che contribuiscono al riscaldamento globale.</li>
        <li><b>Perdita di biodiversità:</b> Specie animali e vegetali minacciate da habitat degradati e inquinamento.</li>
        <li><b>Contaminazione delle acque:</b> Deposizione di inquinanti atmosferici nei laghi, fiumi e mari.</li>
        <li><b>Effetti su suolo e colture:</b> Riduzione della fertilità e della produttività agricola.</li>
      </ul>
    </CardContent>
  </Card>
);

export default EnvironmentalEffects;
