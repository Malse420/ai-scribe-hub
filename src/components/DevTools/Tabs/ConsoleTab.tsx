export const ConsoleTab = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Console Output</h2>
      <div className="bg-neutral-900 text-white p-4 rounded-lg font-mono">
        <p>$ npm start</p>
        <p className="text-green-400">Starting development server...</p>
      </div>
    </div>
  );
};