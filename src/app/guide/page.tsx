export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#E8E6E0] p-8 md:p-16 max-w-4xl mx-auto">
      <h1 className="font-cormorant text-[64px] font-bold mb-12">SOVEREIGN — A Life RPG</h1>

      <section className="mb-12">
        <h2 className="font-cormorant text-[28px] font-bold text-[#C41E1E] mb-4">THE CONCEPT</h2>
        <p className="font-grotesk text-[14px] leading-relaxed">
          Sovereign turns your real-world actions into a kingdom-building game. 
          Complete quests, earn XP, level up your character, and watch your kingdom grow.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-cormorant text-[28px] font-bold text-[#C41E1E] mb-4">YOUR CHARACTER</h2>
        <ul className="font-grotesk text-[14px] leading-relaxed list-disc list-inside space-y-2">
          <li>Choose a class: Scholar, Warrior, Builder, or Commander</li>
          <li>Each class belongs to a House: Zenith, Ash, Forge, or Crown</li>
          <li>Level up by completing quests and earning XP</li>
          <li>Attributes grow as you complete domain-specific quests</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="font-cormorant text-[28px] font-bold text-[#C41E1E] mb-4">THE QUEST BOARD</h2>
        <ul className="font-grotesk text-[14px] leading-relaxed list-disc list-inside space-y-2">
          <li><strong>MANIFEST:</strong> Active quests you can complete</li>
          <li><strong>DORMANT:</strong> Available quests you can start</li>
          <li><strong>FULFILLED:</strong> Completed quests</li>
          <li>Click a quest to see objectives, check them off, and mark complete</li>
          <li>Earn XP, attribute points, and kingdom XP on completion</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="font-cormorant text-[28px] font-bold text-[#C41E1E] mb-4">YOUR KINGDOM</h2>
        <ul className="font-grotesk text-[14px] leading-relaxed list-disc list-inside space-y-2">
          <li>Buildings unlock as your attributes grow</li>
          <li>Manifest available buildings to add them to your kingdom</li>
          <li>Each building provides passive bonuses</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="font-cormorant text-[28px] font-bold text-[#C41E1E] mb-4">THE COMPANION</h2>
        <ul className="font-grotesk text-[14px] leading-relaxed list-disc list-inside space-y-2">
          <li>Aegis is your AI companion</li>
          <li>Ask for quests, advice, or analysis</li>
          <li>Quick prompts: "Give me a quest", "Analyze my week", "I'm struggling"</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="font-cormorant text-[28px] font-bold text-[#C41E1E] mb-4">SETTINGS</h2>
        <ul className="font-grotesk text-[14px] leading-relaxed list-disc list-inside space-y-2">
          <li>Change your character name, kingdom name, companion name</li>
          <li>Switch houses (limited to once per week)</li>
          <li>Logout from the Danger Zone</li>
        </ul>
      </section>

      <div className="mt-16 text-center">
        <a href="/login" className="inline-block bg-[#C41E1E] text-white font-grotesk text-[11px] tracking-[0.2em] uppercase px-8 py-3 border-none hover:bg-[#E8282B] transition-colors duration-150">
          ENTER THE VOID
        </a>
      </div>
    </div>
  )
}
