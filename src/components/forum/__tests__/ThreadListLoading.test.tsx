
import { render, screen } from "@testing-library/react";
import { ThreadListLoading } from "../ThreadListLoading";

describe("ThreadListLoading", () => {
  test("renders the loading skeleton elements", () => {
    render(<ThreadListLoading />);
    
    // Check that we have 3 skeleton loaders (as per the component implementation)
    const skeletons = screen.getAllByTestId("skeleton-loader");
    expect(skeletons).toHaveLength(3);
  });
});
