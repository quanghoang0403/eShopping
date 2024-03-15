using eShopping.WebApi.Controllers.Base;
using MediatR;

namespace eShopping.WebApi.Controllers.ApiStore
{
    public class ProductCategoryController : BaseApiStoreController
    {
        public ProductCategoryController(IMediator mediator) : base(mediator)
        {
        }
    }
}