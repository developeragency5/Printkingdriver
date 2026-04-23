export default function TopBar() {
  return (
    <div className="h-9 bg-[#111110] text-[#a3a39a] text-xs flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Database Version: 4.2.0-STABLE</span>
          </div>
          <span className="text-[#404038]">|</span>
          <span className="hidden sm:inline">⚡ 50,000+ Hardware Protocols Mapped</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white transition-colors">Documentation Library</a>
          <a href="#" className="hover:text-white transition-colors hidden sm:inline">Technical Support</a>
        </div>
      </div>
    </div>
  );
}
