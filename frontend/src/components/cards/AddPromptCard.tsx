interface AddPromptCardProps {
  onClick: () => void;
}

export default function AddPromptCard({ onClick }: AddPromptCardProps) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-2 border-dashed border-gray-200 hover:border-blue-200 cursor-pointer h-[180px]"
    >
      <div className="p-6 h-full flex flex-col items-center justify-center gap-2">
        <div className="w-12 h-12 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors duration-200">
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            Add New Prompt
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Click to create a new prompt
          </p>
        </div>
      </div>
    </div>
  );
}
