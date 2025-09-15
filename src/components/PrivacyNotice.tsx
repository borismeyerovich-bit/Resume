export default function PrivacyNotice() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-semibold text-blue-800 mb-2">🔒 Privacy Notice</h3>
      <div className="text-xs text-blue-700 space-y-1">
        <p>• Your resume is processed securely and <strong>never stored</strong> on our servers</p>
        <p>• We don&apos;t create accounts, track users, or save your personal information</p>
        <p>• Data is processed temporarily and deleted immediately after transformation</p>
        <p>• Processing is done via OpenAI's API (subject to their privacy policy)</p>
      </div>
    </div>
  );
} 