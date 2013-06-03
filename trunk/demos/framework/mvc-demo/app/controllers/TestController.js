/**
 * Created with JetBrains WebStorm.
 * User: C01t
 * Date: 6/1/13
 * Time: 9:16 PM
 * To change this template use File | Settings | File Templates.
 */

NAMESPACE('app.controllers', function () {
    "use strict";

    /** @class app.controllers.TestController */
    CLASS(
        [ria.mvc.Controller('test')],
        'TestController', EXTENDS(app.controllers.Base), [

            [ria.mvc.DependencyInjector],
            app.services.TestService, 'service',

            ria.async.Future, function validateResponse_() {
                var head
                  , me = this;

                (head = new ria.async.Future)
                    .catchError(function (error) {
                        throw app.service.DataException('Failed to load data: ' + error);
                    })
                    .then(function (data) {
                        if (!data.isOkResponse())
                            throw app.service.DataException('Failed to load data: ' + $L(data.getErrorCode()));

                        return data.getValues();
                    })
                    .catchException(app.service.DataException, function (error) {
                        this.BREAK(); // failed with exception, stop further processing

                        // todo: scoping !?
                        me.view.showAlertBox(error.getMessage());
                    });

                return head;
            },

            [[Number, Number, app.model.CoordinateZ]],
            function indexAction(x_, y_, z_) {
                var result = this.service
                    .getSector(x_, y_, z_)
                    .attach(this.validateResponse_());

                /* Put activity in stack and render when result is ready */
                return this.View(app.activities.Test, result);
            },


            [[app.activites.CoordinatesViewModel]],
            function updateSectorAction(model) {
                var result = this.service
                    .updateSector(model.getX(), model.getY(), model.getZ(), model.getValue())
                    .attach(this.validateResponse_());

                /* Update part of view. Activity should implement ria.mvc.IPartial.
                    Activity should be in stack. Render when result is ready */
                return this.PartialView(app.activities.Test, result);
            }
        ]);
})