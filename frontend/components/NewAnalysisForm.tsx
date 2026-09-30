'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Layers, Loader2, Sparkles } from 'lucide-react';
import { InnovationInput, IngredientItem, Jurisdiction } from '../types';
import { Language, i18n } from '../lib/i18n';

interface NewAnalysisFormProps {
  lang: Language;
  onSubmit: (data: InnovationInput) => void;
  isLoading: boolean;
  initialData?: Partial<InnovationInput>;
}

export const NewAnalysisForm: React.FC<NewAnalysisFormProps> = ({
  lang,
  onSubmit,
  isLoading,
  initialData,
}) => {
  const t = i18n[lang];

  const [name, setName] = useState(initialData?.name || 'Nano-Curcumin Bio-Enhanced Effervescent Granules');
  const [description, setDescription] = useState(
    initialData?.description ||
      'A novel sub-micron lipid-carrier formulation containing standardized Curcuma longa extract and Piper nigrum fruit extract, processed into an effervescent quick-dissolve granule matrix for rapid systemic absorption and joint flexibility.'
  );
  const [intendedUse, setIntendedUse] = useState(
    initialData?.intended_use ||
      'Relief of joint stiffness, cartilage support, and modulation of inflammatory biomarkers.'
  );
  const [dosageForm, setDosageForm] = useState(initialData?.dosage_form || 'Effervescent Granules');
  const [manufacturingDetails, setManufacturingDetails] = useState(
    initialData?.manufacturing_details ||
      'Supercritical CO2 extract homogenized via high-shear microfluidization (1500 bar) with plant-derived lecithin surfactant and spray-granulated with citric acid / sodium bicarbonate matrix.'
  );
  const [targetMarket, setTargetMarket] = useState(initialData?.target_market || 'Domestic India');
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>(initialData?.jurisdiction || 'IN');

  const [ingredients, setIngredients] = useState<IngredientItem[]>(
    initialData?.ingredients || [
      {
        name: 'Haridra (Curcuma longa)',
        botanical_name: 'Curcuma longa L.',
        part_used: 'Rhizome (Standardized to 95% Curcuminoids)',
        percentage_or_ratio: '500 mg (70%)',
        origin_state: 'Kerala, India',
        is_classical_ayurvedic: true,
      },
      {
        name: 'Maricha (Piper nigrum)',
        botanical_name: 'Piper nigrum L.',
        part_used: 'Fruit (Standardized to 98% Piperine)',
        percentage_or_ratio: '10 mg (2%)',
        origin_state: 'Karnataka, India',
        is_classical_ayurvedic: true,
      },
    ]
  );

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        name: '',
        botanical_name: '',
        part_used: '',
        percentage_or_ratio: '',
        origin_state: 'India',
        is_classical_ayurvedic: true,
      },
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: keyof IngredientItem, value: any) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      ingredients,
      intended_use: intendedUse,
      dosage_form: dosageForm,
      manufacturing_details: manufacturingDetails,
      target_market: targetMarket,
      jurisdiction,
    });
  };

  return (
    <div className="glass-card rounded-2xl p-6 lg:p-8 transition-all relative overflow-hidden">
      <div className="flex items-center justify-between pb-5 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400 dark:text-cyan-400 light:text-cyan-600" />
            <span>{t.formTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-0.5">{t.formSubtitle}</p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-200 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 font-medium shadow-sm">
          Jurisdiction Mode: <span className="text-cyan-300 dark:text-cyan-300 light:text-cyan-700 font-bold">{jurisdiction}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Row 1: Name & Jurisdiction */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">
              {t.innoNameLabel} <span className="text-cyan-400 dark:text-cyan-400 light:text-cyan-600">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nano-Curcumin Effervescent Tablet"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-white border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-sm transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">
              {t.jurisdictionLabel} <span className="text-cyan-400 dark:text-cyan-400 light:text-cyan-600">*</span>
            </label>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-white border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 text-white dark:text-white light:text-slate-900 text-sm focus:outline-none focus:border-cyan-400 shadow-sm transition-all"
            >
              <option value="IN">India (AYUSH / CDSCO / NBA)</option>
              <option value="US">United States (US FDA DSHEA)</option>
              <option value="AU">Australia (TGA Complementary)</option>
              <option value="INTERNATIONAL">International Cross-Border</option>
            </select>
          </div>
        </div>

        {/* Row 2: Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">
            {t.innoDescLabel} <span className="text-cyan-400 dark:text-cyan-400 light:text-cyan-600">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the formulation, chemical modification, extraction process, and novelty..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-white border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 shadow-sm transition-all"
          />
        </div>

        {/* Row 3: Active Herbal Ingredients */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 flex items-center gap-1.5">
              <span>{t.ingredientsLabel}</span>
              <span className="text-slate-500 light:text-slate-400 text-[11px]">(Classical texts check & ABS tracking)</span>
            </label>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="inline-flex items-center gap-1 text-xs text-cyan-400 dark:text-cyan-400 light:text-cyan-700 hover:underline font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Ingredient</span>
            </button>
          </div>

          <div className="space-y-2">
            {ingredients.map((ing, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 rounded-xl bg-slate-950/50 dark:bg-slate-950/50 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 items-center text-xs shadow-sm"
              >
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    placeholder="Ingredient / Herb Name"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-700/60 dark:border-slate-700/60 light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400 shadow-sm"
                  />
                </div>
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    placeholder="Botanical Name & Part"
                    value={ing.botanical_name || ''}
                    onChange={(e) => handleIngredientChange(idx, 'botanical_name', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-700/60 dark:border-slate-700/60 light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400 shadow-sm"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Dose / Ratio / State"
                    value={ing.percentage_or_ratio || ''}
                    onChange={(e) => handleIngredientChange(idx, 'percentage_or_ratio', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-700/60 dark:border-slate-700/60 light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400 shadow-sm"
                  />
                </div>
                <div className="sm:col-span-1 flex justify-center">
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="p-1 rounded-md text-slate-500 hover:text-rose-500 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 4: Intended Use & Dosage Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">
              {t.intendedUseLabel} <span className="text-cyan-400 dark:text-cyan-400 light:text-cyan-600">*</span>
            </label>
            <input
              type="text"
              required
              value={intendedUse}
              onChange={(e) => setIntendedUse(e.target.value)}
              placeholder="e.g. Joint mobility support and relief of stiffness"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-white border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 shadow-sm transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">
              {t.dosageFormLabel} <span className="text-cyan-400 dark:text-cyan-400 light:text-cyan-600">*</span>
            </label>
            <input
              type="text"
              required
              value={dosageForm}
              onChange={(e) => setDosageForm(e.target.value)}
              placeholder="e.g. Effervescent Tablet, Nano-emulsion, Capsule"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-white border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Row 5: Manufacturing Details */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 flex items-center gap-1.5">
            <span>Manufacturing / Modification Details</span>
            <span className="text-slate-500 light:text-slate-400 text-[11px]">(Evaluates Section 3(p) inventive step vs classical AFI process)</span>
          </label>
          <input
            type="text"
            value={manufacturingDetails}
            onChange={(e) => setManufacturingDetails(e.target.value)}
            placeholder="Extraction method, enzyme processing, novel excipients..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-white border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 shadow-sm transition-all"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-teal-200 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>{t.analyzingBtn}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{t.analyzeBtn}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
