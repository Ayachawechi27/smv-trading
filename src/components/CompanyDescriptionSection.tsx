import React from 'react';
import { ShieldCheck, Truck, Award, Store, Users, UtensilsCrossed, CheckCircle2 } from 'lucide-react';

export const CompanyDescriptionSection: React.FC = () => {
  return (
    <section className="bg-white border-b border-slate-200 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header with Title and Subtitle */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold tracking-wide">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>Présentation Officielle SMV Trading</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            SMV Trading – Importateur et distributeur de produits alimentaires en Tunisie
          </h2>

          <p className="text-base text-slate-600 leading-relaxed">
            SMV Trading est une entreprise spécialisée dans l’importation et la distribution de produits alimentaires en Tunisie. 
            Nous proposons une large sélection de fromages, de charcuteries, de produits laitiers et de spécialités alimentaires importées, 
            soigneusement sélectionnées pour répondre aux attentes des professionnels et des consommateurs.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Accompagnement Professionnel */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Partenaire des Professionnels
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nous accompagnons les <strong>grossistes</strong>, les <strong>restaurants</strong>, les <strong>hôtels</strong> et les <strong>commerces</strong> en leur proposant des produits adaptés à leurs besoins d'approvisionnement régulier et demi-gros.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Conditionnements cartons adaptés</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Disponibilité continue des stocks</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Réseau Grand Public & Enseignes Partenaires */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Accessible aux Particuliers
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nos produits sont également accessibles aux particuliers à travers plusieurs enseignes partenaires de premier plan en Tunisie :
            </p>
            
            {/* Retailers Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-2 bg-white rounded-lg border border-slate-200 text-center font-bold text-xs text-slate-800 shadow-2xs">
                Carrefour
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200 text-center font-bold text-xs text-slate-800 shadow-2xs">
                Monoprix
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200 text-center font-bold text-xs text-slate-800 shadow-2xs">
                Magasin Général (MG)
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200 text-center font-bold text-xs text-slate-800 shadow-2xs">
                Anouar
              </div>
            </div>
          </div>

          {/* Card 3: Notre Engagement Culinaire */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Notre Engagement Qualité
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Vous offrir un choix varié de produits, un service professionnel et des saveurs de qualité pour enrichir chaque expérience culinaire.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Chaîne du froid certifiée</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Traçabilité & DLC fraîches d'origine</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
