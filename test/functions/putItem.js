"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const dynamodb_toolbox_1 = require("../dynamodb-toolbox");
exports.main = async ({ type }) => {
    const id = "uniqueID-test";
    await dynamodb_toolbox_1.TestEntity.put({
        type,
        id,
    });
    console.log("id", id);
    return id;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHV0SXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInB1dEl0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMERBQWlEO0FBRXBDLFFBQUEsSUFBSSxHQUFHLEtBQUssRUFBRSxFQUFFLElBQUksRUFBb0IsRUFBbUIsRUFBRTtJQUN4RSxNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUM7SUFFM0IsTUFBTSw2QkFBVSxDQUFDLEdBQUcsQ0FBQztRQUNuQixJQUFJO1FBQ0osRUFBRTtLQUNILENBQUMsQ0FBQztJQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3RCLE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSBcInV1aWRcIjtcbmltcG9ydCB7IFRlc3RFbnRpdHkgfSBmcm9tIFwiLi4vZHluYW1vZGItdG9vbGJveFwiO1xuXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICh7IHR5cGUgfTogeyB0eXBlOiBzdHJpbmcgfSk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gIGNvbnN0IGlkID0gXCJ1bmlxdWVJRC10ZXN0XCI7XG5cbiAgYXdhaXQgVGVzdEVudGl0eS5wdXQoe1xuICAgIHR5cGUsXG4gICAgaWQsXG4gIH0pO1xuICBjb25zb2xlLmxvZyhcImlkXCIsIGlkKTtcbiAgcmV0dXJuIGlkO1xufTtcbiJdfQ==