import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import { pollsApi } from "@/api/polls";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// 1. Zod Validation Schema matching your backend createPollSchema
const pollValidationSchema = z.object({
  title: z.string().min(5, "Poll title must be at least 5 characters long"),
  isAnonymous: z.boolean().default(false).optional(),
  expiresAt: z.string().min(1, "Please select an expiration date and time"),
  questions: z.array(
    z.object({
      text: z.string().min(3, "Question text is required"),
      isMandatory: z.boolean().default(true).optional(),
      options: z.array(z.string().min(1, "Option text cannot be empty")).min(2, "Provide at least 2 options per question"),
    })
  ).min(1, "Your poll must contain at least one question"),
});

type PollFormValues = z.infer<typeof pollValidationSchema>;

const CreatePoll = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Setup react-hook-form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PollFormValues>({
    resolver: zodResolver(pollValidationSchema),
    defaultValues: {
      title: "",
      isAnonymous: false,
      expiresAt: "",
      questions: [
        { text: "", isMandatory: true, options: ["", ""] } // Start with 1 default question & 2 blank option slots
      ],
    },
  });

  // 3. Dynamic Question Array Controller
  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: "questions",
  });

  // 4. Form Submission Handler
  const onSubmit = async (data: PollFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      // Convert HTML datetime-local string format directly into ISO format for Drizzle
      const payload = {
        ...data,
        expiresAt: new Date(data.expiresAt).toISOString(),
        // Filter out empty strings from options array
        questions: data.questions.map(q => ({
          ...q,
          options: q.options.filter(opt => opt.trim() !== "")
        }))
      };
      
      await pollsApi.createPoll(payload);
      alert("Poll structure successfully deployed into database draft status! 🚀");
      navigate("/dashboard");
    } catch (err: any) {
      setServerError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased selection:bg-blue-500/30">
      
      {/* HEADER SECTION */}
      <header className="border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-zinc-500 hover:text-white text-sm transition-colors">&larr; Dashboard</Link>
            <span className="text-zinc-800">/</span>
            <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Poll Builder Engine</h1>
          </div>
        </div>
      </header>

      {/* CORE CONTENT LAYOUT */}
      <main className="mx-auto max-w-3xl px-4 py-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {serverError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
              ⚠️ {serverError}
            </div>
          )}

          {/* SECTION A: METADATA GLOBAL CONFIG */}
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-6 space-y-6">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-blue-500 border-b border-zinc-900 pb-2">01. Global Parameters</h2>
            
            {/* Poll Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Poll Title / Goal</label>
              <input
                {...register("title")}
                placeholder="e.g., Q3 Engineering Feedback Framework Surveys"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-zinc-600 font-medium"
              />
              {errors.title && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide">{errors.title.message}</p>}
            </div>

            {/* Timing Expiration & Options Configuration Dual Row */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Lock Expiration Clock</label>
                <input
                  type="datetime-local"
                  {...register("expiresAt")}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all text-zinc-400 font-mono"
                />
                {errors.expiresAt && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide">{errors.expiresAt.message}</p>}
              </div>

              <div className="space-y-3 flex flex-col justify-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    {...register("isAnonymous")}
                    className="h-4 w-4 rounded bg-zinc-900 border-zinc-800 text-blue-600 focus:ring-0 focus:ring-offset-0 transition-all outline-none"
                  />
                  <div>
                    <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">Anonymous Voting Mode</span>
                    <p className="text-[10px] text-zinc-500 leading-none mt-0.5">Enabling ignores tracking external visitor credentials records.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* SECTION B: QUESTIONS COLLECTION FIELDS LAYOUT */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-blue-500">02. Question Formulation Block</h2>
              {errors.questions && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide">{errors.questions.message}</p>}
            </div>

            {questionFields.map((questionField, qIndex) => (
              <div 
                key={questionField.id} 
                className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-6 space-y-6 relative group/box hover:border-zinc-800 transition-colors"
              >
                {/* Remove Question Anchor Link */}
                {questionFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="absolute top-4 right-4 text-xs text-zinc-600 hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer"
                  >
                    Delete Question
                  </button>
                )}

                {/* Question Label Heading Text */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase">Question Slot #{qIndex + 1}</span>
                  <input
                    {...register(`questions.${qIndex}.text` as const)}
                    placeholder="What is your assessment of..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-zinc-700 font-semibold text-zinc-200"
                  />
                  {errors.questions?.[qIndex]?.text && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide">{errors.questions[qIndex]?.text?.message}</p>
                  )}
                </div>

                {/* OPTIONS INNER COMPILATION LAYER */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 block">Choices Choices Matrix</label>
                  
                  {/* Quick Dynamic Inner Options Mapping Handler */}
                  {[0, 1, 2, 3].map((optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-700 w-4">{optIndex + 1}.</span>
                      <input
                        {...register(`questions.${qIndex}.options.${optIndex}` as const)}
                        placeholder={`Option alternative slot payload text... ${optIndex > 1 ? '(Optional)' : ''}`}
                        className="flex-1 bg-zinc-950/60 border border-zinc-900 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition-all placeholder:text-zinc-700 text-zinc-300"
                      />
                    </div>
                  ))}
                  {errors.questions?.[qIndex]?.options && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide">{errors.questions[qIndex]?.options?.message}</p>
                  )}
                </div>

                {/* Question Setting Configurations Toggle */}
                <div className="flex items-center gap-4 pt-2 border-t border-zinc-950/60">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register(`questions.${qIndex}.isMandatory` as const)}
                      className="h-3.5 w-3.5 rounded bg-zinc-950 border-zinc-900 text-blue-600 focus:ring-0 outline-none"
                    />
                    <span className="text-xs font-medium text-zinc-500">Require voter selection to pass submission rules</span>
                  </label>
                </div>
              </div>
            ))}

            {/* Add Next Question Action Row Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendQuestion({ text: "", isMandatory: true, options: ["", ""] })}
              className="w-full py-6 border-dashed border-zinc-800 hover:border-zinc-700 text-zinc-400 bg-transparent text-xs font-bold tracking-wide uppercase transition-colors"
            >
              + Add Sub-Question Block Slot
            </Button>
          </div>

          {/* ENGINE TRIGGER SUMBIT SUBMISSION BAR */}
          <div className="pt-6 border-t border-zinc-900 flex items-center justify-end gap-4">
            <Button asChild variant="outline" className="border-zinc-800 text-zinc-400 hover:bg-zinc-900 bg-transparent px-6 font-semibold">
              <Link to="/dashboard">Cancel</Link>
            </Button>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 font-bold shadow-lg shadow-blue-500/10"
            >
              {isLoading ? "Compiling Schema Structure..." : "Deploy Ballot Structure"}
            </Button>
          </div>

        </form>
      </main>
    </div>
  );
}

export default CreatePoll