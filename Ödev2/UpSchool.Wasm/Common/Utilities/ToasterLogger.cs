using UpSchool.Domain.Common;
using UpSchool.Domain.Services;
using UpSchool.Wasm.Services;

namespace UpSchool.Wasm.Common.Utilities
{
    public class ToasterLogger : LoggerBase
    {
        private readonly IToasterService _toasterService;
        private readonly string _apiurl;

        public ToasterLogger(IToasterService toasterService, string apiUrl): base(apiUrl)
        {
            _toasterService = toasterService;

            }
        public override void Log(string message)
        {
            _toasterService.ShowSuccess(message);
            base.Log(message);

        }

    }
}
