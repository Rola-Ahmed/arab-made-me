import { connectDB } from "./database/connection.js"
import { categoriesRouter } from "./modules/categories/categories.routes.js"
import { chatRouter } from "./modules/chatting/chatting.routes.js"
import { contactUsRouter } from "./modules/contact_us/contactUs.routes.js"
import { endorsementRouter } from "./modules/endorsements/endorsement.routes.js"
import { factoriesRouter } from "./modules/factories/factories.routes.js"
import { importersRouter } from "./modules/importers/importers.routes.js"
import { privateLabelingRouter } from "./modules/private_labeling/privateLabeling.routes.js"
import { productsRouter } from "./modules/products/products.routes.js"
import { purchasingOrderRouter } from "./modules/purchasingOrders/purchasing_order.routes.js"
import { quotationRequestRouter } from "./modules/quotationRequests/quotationRequests.routes.js"
import { quotationsRouter } from "./modules/quotations/quotations.routes.js"
import { quotationsUpdatesRouter } from "./modules/quotations_updates/quotations.routes.js"
import { reviewsRouter } from "./modules/reviews/reviews.routes.js"
import { sectorsRoute } from "./modules/sectors/sectors.routes.js"
import { sessionsRouter } from "./modules/sessions/sessions.routes.js"
import { shippingRouter } from "./modules/shipping company/shipping.routes.js"
import { sourcingOfferRouter } from "./modules/sourcing_hub/offers/offers.routes.js"
import { sourcingQuotationsRouter } from "./modules/sourcing_hub/quotations/quotations.routes.js"
import { sourcingRequestRouter } from "./modules/sourcing_hub/requests/requests.routes.js"
import { specialManufacturingRequestRouter } from "./modules/specialManufacturingRequests/specialManufacturingRequests.routes.js"
import { subscriptionsRouter } from "./modules/subscriptions/subscriptions.routes.js"
import { teamRouter } from "./modules/team_member/team.routes.js"
import { usersRouter } from "./modules/users/users.routes.js"
import { visitRouter } from "./modules/visit/visit.routes.js"
import { whiteLabelingsRouter } from "./modules/white_labeling/whiteLabeling.routes.js"
import { globalErrorHandler } from "./utils/error_handling.js"

export const bootstrap = (app) => {
    connectDB()

    app.use("/api/v1/users", usersRouter)
    app.use("/api/v1/factories", factoriesRouter)
    app.use("/api/v1/sectors", sectorsRoute)
    app.use("/api/v1/importers", importersRouter)
    app.use("/api/v1/shippingCompanies", shippingRouter)
    app.use("/api/v1/products", productsRouter)
    app.use('/api/v1/categories', categoriesRouter)
    app.use("/api/v1/rfqs", quotationRequestRouter)
    app.use("/api/v1/quotations", quotationsRouter)
    app.use("/api/v1/pos", purchasingOrderRouter)
    app.use("/api/v1/sourcingRequests", sourcingRequestRouter)
    app.use("/api/v1/sourcingOffers", sourcingOfferRouter)
    //app.use("/api/v1/sourcingQuotations",sourcingQuotationsRouter)
    app.use("/api/v1/spmfs", specialManufacturingRequestRouter)
    app.use("/api/v1/privateLabelings", privateLabelingRouter)
    app.use("/api/v1/subscriptions", subscriptionsRouter)
    app.use("/api/v1/contactUs", contactUsRouter)
    app.use("/api/v1/visits", visitRouter)
    app.use("/api/v1/chats", chatRouter)
    app.use("/api/v1/reviews", reviewsRouter)
    app.use("/api/v1/teams", teamRouter)
    app.use("/api/v1/endorsements", endorsementRouter)
    app.use("/api/v1/sessions",sessionsRouter)
    app.use("/api/v1/whiteLabelings",whiteLabelingsRouter)
    app.use("/api/v1/quotationUpdates",quotationsUpdatesRouter)
    app.use(globalErrorHandler)
    app.use("*", (req, res, nxt) => {
        return res.status(404).json({ "message": "404 Not Found" })
    })
}